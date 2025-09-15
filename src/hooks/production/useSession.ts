"use client";
import useSWR from "swr";
import { getSession } from "@/lib/api";


export function useSession() {
const { data, error, isLoading, mutate } = useSWR("/api/session", getSession, {
revalidateOnFocus: false,
});
return { session: data, error, isLoading, refresh: () => mutate() };
}