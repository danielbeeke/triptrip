import { Definition } from 'uce'

export interface Serializable {
  id: string
}

export type RouterPage = Definition<{}, {
  location: { params: { [key: string]: string } }
}>

export type MediaOptions = {
  type: string,
  file: File,
  handle: FileSystemFileHandle,
  exif?: { 
    DateTimeOriginal: Date,
    latitude?: number,
    longitude?: number,  
  },
  startTime: Date,
  endTime: Date,
  duration?: number,
  latitude?: number,
  longitude?: number,
  geoJSON?: {}
}

export type Track = {
  extra: {
    xyz: string
  }
}

export type Slicer = {
  type: string,
  startTime: Date,
  endTime: Date,
  gpx?: unknown
}