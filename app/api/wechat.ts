import {generateHeader} from "@/app/api/common";

export async function getWechatLoginStatue(eventKey: string) {
    const header = generateHeader()
    const res = await fetch(
        `/mall-api/mall-portal/sso/getTokenByWx?eventKey=${eventKey}`,
        {
            headers: header,
        },
    );
    return res.json();
}

export async function getQRCode() {
    const res = await fetch("/mall-api/mall-portal/sso/getQrCode");
    return res.json();
}

export async function getUserInfo() {
    const header = generateHeader()
    const res = await fetch("/mall-api/mall-portal/sso/info", {
        headers: header,
    });
    const validData = await res.json();
    if(validData.code <= 200){
        return validData
    }
    throw validData.message
}

export async function bindInvitationCode(code: string) {
    const header = generateHeader()
    const res = await fetch(
        `/mall-api/mall-portal/sso/bindInvationCode?code=${code}`,
        {
            headers: header,
        },
    );
    const validData = await res.json();
    if (validData.code === 500) {
        window.alert(validData.message)
        throw validData.message
    }
    return validData
}

export type Invitation = {
    endtime: string;
    id: string;
    invitationcode: string;
    memberid: string;
};

export type InvitationCodeResponse = {
    code: string;
    data: Invitation;
    message: string;
};

export async function getInvitationCode() {
    const header = generateHeader()
    const res = await fetch(`/mall-api/mall-portal/sso/getInvationCode`, {
        headers: header,
    });
    const validData = await res.json();
    if(validData.code <= 200){
        return validData as unknown as InvitationCodeResponse;
    }
    throw validData.message
}
