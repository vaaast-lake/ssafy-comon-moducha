import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import editorConfig from './editorConfig';
import 'ckeditor5/ckeditor5.css';
import './TextEditor.css';
import { Dispatch, SetStateAction } from 'react';

interface EditorType {
  content?: string;
  setInput: Dispatch<SetStateAction<string>>;
}

export default function TextEditor({ content, setInput }: EditorType) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={editorConfig as any}
      data={content}
      onBlur={(event, editor) => setInput(editor.getData())}
    />
  );
}
