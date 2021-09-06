import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import EditorJS from "@editorjs/editorjs";

import {data} from '../constants/dataForEditor'
import {tools} from '../constants/toolsForEditor'


function Editor() {
    // const [pageTitle,setPageTitle] = useState('');
    // const [pageUrl,setPageUrl] = useState('')
    const editor = new EditorJS({
        /**
         * Enable/Disable the read only mode
         */
        readOnly: false,

        /**
         * Wrapper of Editor
         */
        holder: 'editorjs',

        tools: tools,

        /**
         * This Tool will be used as default
         */
        // defaultBlock: 'paragraph',

        /**
         * Initial Editor data
         */
        data: data    });


    return (
        <div className="Editor" style={{display:'flex', flexDirection:'column',justifyContent:'space-between'}}>
            <div style={{margin:'10px'}}>
                <button onClick={() => {
                    editor.save()
                        .then((outputdata) => {
                            outputdata.title = 'hm'
                            console.log(outputdata);
                        })
                        .catch(err => {
                            console.log("ERROR");
                            console.log(err);
                        })
                }}>
                    Save the data
                </button>
            </div>
            <div style={{margin:'10px'}}>
                <TextField required id="standard-required" label="Required" defaultValue="Hello World"/>
            </div>
            <div id="editorjs"></div>
        </div>
    );
}

export default Editor;