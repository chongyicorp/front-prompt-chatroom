import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";
import md5 from "spark-md5";
import { ACCESS_CODE_PREFIX } from "../constant";
import { OPENAI_URL } from "./common";

const BASE_URL = "https://cyprompts.com/api";

function getIP(req: NextRequest) {
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "";
  }

  return ip;
}

function parseApiKey(bearToken: string) {
  const token = bearToken.trim().replaceAll("Bearer ", "").trim();
  const isOpenAiKey = !token.startsWith(ACCESS_CODE_PREFIX);

  return {
    accessCode: isOpenAiKey ? "" : token.slice(ACCESS_CODE_PREFIX.length),
    apiKey: isOpenAiKey ? token : "",
  };
}

async function getAppKey(req: NextRequest){
  const controller = new AbortController();
  const authValue = req.headers.get("Authorization") ?? "";
  const urlPath = "/mall-portal/sso/getInvationCode";

  let baseUrl = BASE_URL;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10 * 60 * 1000);

  const fetchUrl = `${baseUrl}/${urlPath}`;
  console.log("fetchURl ${authValue}", authValue);
  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: authValue.trim().replaceAll("Bearer ", "").trim(),
    },
    cache: "no-store",
    method: "GET"
  };

  console.log("fetchURl fetchOptions");
  try {
    const res = await fetch(fetchUrl, fetchOptions);

    if (res.status === 401 || res.status == 500)  {
      console.log(res)
      // to prevent browser prompt for credentials
      const newHeaders = new Headers(res.headers);
      newHeaders.delete("www-authenticate");
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: newHeaders,
      });
    }

    console.log(res);
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function auth(req: NextRequest,skipCustomKey=true) {
  
  const res = await getAppKey(req);
  const resJson = await res.json();
  const appkey = resJson.data.appkey;
  const date = resJson.data.endtime;
  const now = new Date();
  if(now > date){
    return {
      error: true,
      msg: "邀请码已过期，请重新输入邀请码",
    };
  }
  console.log("resjson",resJson);

  console.log("appkey", appkey);
  req.headers.set("Authorization", `Bearer ${appkey}`);
  return {
    error: false,
  };
  
  // const authToken = req.headers.get("Authorization") ?? req.nextUrl.searchParams.get("Authorization") ?? "";

  // // check if it is openai api key or user token
  // const { accessCode, apiKey: token } = parseApiKey(authToken);

  // const hashedCode = md5.hash(accessCode ?? "").trim();

  // const serverConfig = getServerSideConfig();
  // console.log("[Auth] allowed hashed codes: ", [...serverConfig.codes]);
  // console.log("[Auth] got access code:", accessCode);
  // console.log("[Auth] hashed access code:", hashedCode);
  // console.log("[User IP] ", getIP(req));
  // console.log("[Time] ", new Date().toLocaleString());

  // if (serverConfig.needCode && !serverConfig.codes.has(hashedCode)) {
  //   if(!token || !skipCustomKey){
  //     return {
  //       error: true,
  //       msg: !accessCode ? "empty access code" : "wrong access code",
  //     };
  //   }
  // }

  // // if user does not provide an api key, inject system api key
  // if (!token) {
  //   const apiKey = serverConfig.apiKey;
  //   if (apiKey) {
  //     console.log("[Auth] use system api key");
  //     req.headers.set("Authorization", `Bearer ${apiKey}`);
  //   } else {
  //     console.log("[Auth] admin did not provide an api key");
  //   }
  // } else {
  //   console.log("[Auth] use user api key");
  // }

  // return {
  //   error: false,
  // };
}
