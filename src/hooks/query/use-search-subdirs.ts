import { useQuery } from "@tanstack/react-query";
import FilesService from "#/api/files-service/files-service.api";

export const useSearchSubdirs = (path: string | null) =>
  useQuery({
    queryKey: ["file", "search_subdirs", path],
    queryFn: () => FilesService.searchSubdirs(path as string),
    enabled: !!path,
    retry: false,
    meta: { disableToast: true },
  });

export const useHomeDirectory = () =>
  useQuery({
    queryKey: ["file", "home"],
    queryFn: () => FilesService.getHome(),
    retry: false,
    meta: { disableToast: true },
    staleTime: Infinity,
  });
