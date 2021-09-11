import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import EditorJS from "@editorjs/editorjs";
import {data} from '../../constants/home/about';
import {tools} from '../../constants/toolsForEditor';
  
var editorJson = ''

function onSaveHandler(data,setPageJson) {  
    console.log(data)
    editorJson = JSON.stringify(data)
    setPageJson(data)
    console.log(editorJson)
  }  

function About() {
    // const [pageTitle,setPageTitle] = useState('');
    // const [pageUrl,setPageUrl] = useState('')
    const [pageJson,setPageJson] = useState(data)
    const editor = new EditorJS({
        /**
         * Enable/Disable the read only mode
         */
        readOnly: false,
        holder: 'editorjs',
        tools: tools,
        data: pageJson   
    });


    return (
        <div className="Editor" style={{display:'flex', flexDirection:'column',justifyContent:'space-between'}}>
            <div style={{margin:'10px'}}>
                <button onClick={() => {
                    editor.save()
                        .then((outputdata) => {
                            outputdata.title = 'hm'
                            onSaveHandler(outputdata,setPageJson)
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
                <TextField id="standard-json" label="Json from editor" value={JSON.stringify(pageJson)}/>
            </div>
            <div id="editorjs"></div>
        </div>
    );
}

export default About;