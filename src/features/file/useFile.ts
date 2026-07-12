import { useQuery } from "@tanstack/react-query";
import * as FileApi from "./file.api"

export function useFile(fileId?: number | null){
    const getFileQuery = useQuery({
        queryKey: ["file", fileId],
        queryFn: () => {
            return FileApi.getFileInformation({fileId: fileId!})
        },
        enabled: !!fileId,
        staleTime: 5*60*1000
    })

    return {file: getFileQuery.data}
}