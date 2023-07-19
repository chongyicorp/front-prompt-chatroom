import React, {useEffect, useState} from "react";
import {
    getQRCode,
    getUserInfo,
    getWechatLoginStatue,
    getInvitationCode,
    bindInvitationCode,
} from "@/app/api/wechat";
import {useInterval} from "@/app/utils/hooks";
import {useWechatStatus} from "@/app/store/wechat";
import CloseIcon from "../icons/close.svg";

const UserInfoForm = () => {
    const {wechatData, userInfo} = useWechatStatus();
    const [editable, setEditable] = useState(!wechatData?.invitationcode)
    const [code, setCode] = useState("");

    useEffect(() => {
        if (!wechatData?.invitationcode) return;
        setCode(wechatData.invitationcode);
        setEditable(false)
    }, [wechatData?.invitationcode]);


    // if (!wechatData || !userInfo) return null;

    return (
        <div>
            <h3 className="text-center text-2xl mb-[20px]">用户信息</h3>
            <label className="daisy-label cursor-pointer justify-start">
                <span className="daisy-label-text mr-[10px]"> 编辑</span>
                <input type="checkbox" className="daisy-toggle" checked={editable} onChange={e => {
                    setEditable(e.target.checked)
                }}/>
            </label>
            <div className="daisy-form-control w-full max-w-xs">
                <label className="daisy-label">
                    <span className="daisy-label-text">用户名</span>
                </label>
                <div className="px-[10px]">
                    {userInfo?.username || userInfo?.realname}
                </div>
            </div>
            <div className="daisy-form-control w-full max-w-xs">
                <label className="daisy-label">
                    <span className="daisy-label-text">邀请码</span>
                </label>
                {
                    editable ? <input
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                            }}
                            type="text"
                            className="daisy-input daisy-input-sm daisy-input-bordered w-full max-w-xs"
                        /> :
                        <label className="daisy-label">
                            <span className="daisy-label-text">{code}</span>
                        </label>
                }

            </div>

            {
                editable && <a
                    className="daisy-btn daisy-btn-sm mt-[15px]"
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (!code) {
                            window.alert("邀请码不能为空");
                        }
                        await bindInvitationCode(code);
                        window.alert("绑定邀请码成功");
                        setEditable(false)
                    }}
                >
                    提交信息
                </a>
            }

        </div>
    );
};

export const WechatLogin = () => {
    const {
        userInfo,
        updateWechatData,
        updateUserInfo,
        updateWechatLoginStatus,
    } = useWechatStatus();
    const [ticketStr, setTicketStr] = useState("");
    const [sceneStr, setSceneStr] = useState("");

    const handleLogin = async () => {
        try {
            const {data} = await getQRCode();
            setTicketStr(data.ticket);
            setSceneStr(data.sceneStr);
            await fetchUserInfo()
        } catch (error) {
            console.log(error);
        }
    };

    const clear = useInterval(() => {
        if (userInfo) return;
        handleLogin();
    }, 1000 * 30);

    const clearStatus = useInterval(() => {
        if (!sceneStr) return;
        if (userInfo) return;
        fetchWechatLoginStatue();
    }, 3000);

    const fetchUserInfo = async () => {
        try {
            const {data: userInfo} = await getUserInfo();
            updateUserInfo(userInfo);
        } catch (e) {
            console.log(e)
        }
    }

    const fetchWechatLoginStatue = async () => {
        try {
            const {data} = await getWechatLoginStatue(sceneStr);
            if (data) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("tokenHead", data.tokenHead);
                updateWechatLoginStatus(true);
                clear();
                clearStatus();
                fetchUserInfo()
                const {data: invitationData} = await getInvitationCode();
                updateWechatData(invitationData);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        handleLogin();
    }, []);

    return (
        <div className="min-h-[350px]">
            {userInfo ? (
                <UserInfoForm/>
            ) : (
                <div>
                    <h3 className="text-center text-2xl mb-[20px]">请使用微信扫码登录</h3>
                    <div className="mb-[20px] text-center">
                        {ticketStr ? (
                            <img
                                className="inline-block w-[15rem]"
                                src={`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticketStr}`}
                                alt="二维码"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-[15rem]">
                                <span className="daisy-loading daisy-loading-infinity daisy-loading-lg"></span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
