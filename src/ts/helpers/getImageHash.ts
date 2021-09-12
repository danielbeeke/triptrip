import blockhash from "blockhash-core"
import { getImageData } from "@canvas/image"

export const getImageHash = async (file: File) => {
    try {
        const image = new globalThis.Image()
        image.src = URL.createObjectURL(file)
        await image.decode()
        /** @ts-ignore */
        const imageData = await getImageData(image)
        return await blockhash.bmvbhash(imageData, 8)    
    }
    catch (exception) {
        return null
    }
}
