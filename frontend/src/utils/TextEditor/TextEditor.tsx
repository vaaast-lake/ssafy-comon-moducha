import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import editorConfig from './editorConfig';
import 'ckeditor5/ckeditor5.css';
import './TextEditor.css';
import { Dispatch, SetStateAction } from 'react';

interface EditorType {
  setInput: Dispatch<SetStateAction<string>>;
}

export default function TextEditor({ setInput }: EditorType) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  return (
    <div>
      <div className="main-container">
        <div
          className="editor-container editor-container_classic-editor"
          ref={editorContainerRef}
        >
          <div className="editor-container__editor">
            <div ref={editorRef}>
              {isLayoutReady && (
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  onBlur={(event, editor) => setInput(editor.getData())}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
