import { Definition, html } from 'uce'
import { Media } from './objects/Media'

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
  imageHash?: any,
  rootHandle: FileSystemDirectoryHandle
}

export type Track = {
  Duration: string,
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

export interface Chunker {
  chunk (data: Array<Media | Slicer>): void
}

export interface FileIndexer {
  extensions: Array<string>
  defaultBlock: string
  outputType: string
  indexFile (handle: FileSystemFileHandle, rootHandle: FileSystemDirectoryHandle): Promise<Media>
}

export interface Titler {
  titlePart (data: Array<Media>): string
}

export interface Block {
  blockTypes: Array<string>
  block (items: Array<Media>)
}
