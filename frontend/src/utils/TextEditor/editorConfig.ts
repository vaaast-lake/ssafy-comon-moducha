import translations from 'ckeditor5/translations/ko.js';
import {
  Autosave,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontSize,
  Italic,
  Paragraph,
  SelectAll,
  Underline,
  Undo,
} from 'ckeditor5';
const editorConfig = {
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'selectAll',
      '|',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'underline',
    ],
    shouldNotGroupWhenFull: false,
  },
  plugins: [
    Autosave,
    Bold,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontSize,
    Italic,
    Paragraph,
    SelectAll,
    Underline,
    Undo,
  ],
  fontFamily: {
    supportAllValues: true,
  },
  fontSize: {
    options: [10, 12, 14, 'default', 18, 20, 22],
    supportAllValues: true,
  },
  initialData: '',
  language: 'ko',
  placeholder: '본문을 입력하세요',
  translations: [translations],
};
export default editorConfig;
