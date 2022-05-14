/** @format */

import AdobeAiFile from "../../../assets/thumbs/Ai.png";
import AppFile from "../../../assets/thumbs/app.png";
import C4DFile from "../../../assets/thumbs/C4D.png";
import MicrosoftExcelFile from "../../../assets/thumbs/excel.png";
import AppleKeynoteFile from "../../../assets/thumbs/keynote.png";
import MusicFile from "../../../assets/thumbs/music.png";
import AppleNumbersFile from "../../../assets/thumbs/numbers.png";
import ApplePagesFile from "../../../assets/thumbs/page.png";
import PDFFile from "../../../assets/thumbs/pdf.png";
import MarkdownFile from "../../../assets/thumbs/markdown.png";
import PictureFile from "../../../assets/thumbs/picture.png";
import MicrosoftPowerPointFile from "../../../assets/thumbs/ppt.png";
import AdobePsFile from "../../../assets/thumbs/Ps.png";
import VideoFile from "../../../assets/thumbs/video.png";
import MicrosoftWordFile from "../../../assets/thumbs/word.png";
import CompressedFile from "../../../assets/thumbs/zip.png";
import SketchFile from "../../../assets/thumbs/sketch.png";
import TextFile from "../../../assets/thumbs/txt.png";
import UnknownFile from "../../../assets/thumbs/unknown.png";

export const lookup = (ext: string, mime: string) => {
  if (mime === "text/markdown") return MarkdownFile;
  if (mime === "application/pdf") return PDFFile;
  if (mime.startsWith("text/")) return TextFile;
  if (mime.startsWith("image/")) return PictureFile;
  if (mime.startsWith("audio/")) return MusicFile;
  if (mime.startsWith("video/")) return VideoFile;
  switch (ext) {
    case "doc":
    case "docx":
    case "docm":
    case "rtf":
      return MicrosoftWordFile;
    case "ppt":
    case "pptm":
    case "pptx":
      return MicrosoftPowerPointFile;
    case "xls":
    case "xlsx":
    case "xlsm":
      return MicrosoftExcelFile;
    case "pages":
      return ApplePagesFile;
    case "keynote":
      return AppleKeynoteFile;
    case "numbers":
      return AppleNumbersFile;
    case "ps":
      return AdobePsFile;
    case "ai":
      return AdobeAiFile;
    case "pkg":
    case "AppImage":
    case "exe":
    case "ps1":
    case "bat":
    case "sh":
    case "cmd":
    case "dmg":
      return AppFile;
    case "c4d":
      return C4DFile;
    case "sketch":
      return SketchFile;
    case "zip":
    case "7z":
    case "tar":
    case "rar":
    case "zipx":
    case "gz":
    case "xz":
      return CompressedFile;
    default:
      return UnknownFile;
  }
};
