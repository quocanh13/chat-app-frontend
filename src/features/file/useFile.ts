import { useQuery } from "@tanstack/react-query";
import * as FileApi from "./file.api"

export function useFile(fileId: number){
    const getFileQuery = useQuery({
        queryKey: ["file", fileId],
        queryFn: () => {
            return FileApi.getFileInformation({fileId})
        },
        staleTime: Infinity
    })

    return {file: getFileQuery.data}
}