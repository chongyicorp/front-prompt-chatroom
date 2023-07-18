import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "@/app/constant";
import { Invitation } from "@/app/api/wechat";

export type TUserInfo = {
  username: string;
  realname: string;
};

export type WechatStore = {
  userInfo: TUserInfo | null;
  wechatData: Invitation | null;
  wechatLoginStatus: boolean;
  updateUserInfo: (data: TUserInfo) => void;
  updateWechatData: (data: Invitation) => void;
  updateWechatLoginStatus: (data: boolean) => void;
};

export const useWechatStatus = create<WechatStore>()(
  persist(
    (set, get) => ({
      userInfo: null,
      wechatData: null,
      wechatLoginStatus: false,
      updateUserInfo: (data) => {
        set(() => ({
          userInfo: data,
        }));
      },
      updateWechatData: (data) => {
        if (data) {
          set(() => ({
            wechatData: data,
          }));
        }
      },
      updateWechatLoginStatus: (status) => {
        set(() => ({
          wechatLoginStatus: status,
        }));
      },
    }),
    {
      name: StoreKey.Wechat,
      version: 1,
    },
  ),
);
