"use client";

import { create } from "zustand";
import { AppNotification } from "@/lib/types";

interface NotificationsState {
  notifications: AppNotification[];
  push: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markAllRead: () => void;
  unreadCount: number;
}

let counter = 0;

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  push: (n) => {
    counter += 1;
    const notification: AppNotification = {
      ...n,
      id: `notif-${Date.now()}-${counter}`,
      createdAt: Date.now(),
      read: false,
    };
    set({
      notifications: [notification, ...get().notifications].slice(0, 30),
      unreadCount: get().unreadCount + 1,
    });
  },

  markAllRead: () => {
    set({
      notifications: get().notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    });
  },
}));
