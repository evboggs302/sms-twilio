import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./Maverick.css";
import fs from "fs";

function Basic(props) {
  const [myFiles, setMyFiles] = useState([]);
  const [showImages, setShowImages] = useState(false);

  function removeDuplicates(array, key) {
    return array.reduce((accumulator, element) => {
      if (!accumulator.find((el) => el[key] === element[key])) {
        accumulator.push(element);
      }
      return accumulator;
    }, []);
  }

  const onDropAccepted = (acceptedFiles) => {
    if (myFiles.length) {
      let final = removeDuplicates([...myFiles, ...acceptedFiles], "name");
      setMyFiles(final);
    } else {
      setMyFiles([...myFiles, ...acceptedFiles]);
    }
  };

  const options = {
    noKeyboard: true,
    onDropAccepted: onDropAccepted,
    multiple: true,
    accept: "image/*",
  };

  const { rejectedFiles, getRootProps, getInputProps } = useDropzone(options);

  const removeFile = (file) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const removeAll = () => {
    setMyFiles([]);
  };

  const files = myFiles.map((file) => (
    <li key={file.path}>
      {file.path} / {file.size} bytes{" "}
      <button onClick={removeFile(file)}>Remove File</button>
    </li>
  ));

  // const rejects = rejectedFiles.map((file) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));

  const mappedImages = myFiles.map((e, index) => {
    return <img key={index} src={URL.createObjectURL(e)} alt={e.name} />;
  });

  const save = () => {
    const formData = new FormData();
    formData.append("name", "Oliver");
    formData.append("image", myFiles[0]);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post("/api/savePhoto", formData, config);
  };

  // console.log(myFiles.sort((a, b) => a["name"] - b["name"]));
  return (
    <section className="container">
      {showImages ? <div>{mappedImages}</div> : <div />}
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Accepted Files</h4>
        <ul>{files}</ul>
        {/* <h4>Rejected Files</h4>
        <ul>{rejects}</ul> */}
      </aside>
      {!files.length ? (
        <div />
      ) : (
        <div>
          <button onClick={removeAll}>Remove All</button>
          <br />
          <button onClick={() => setShowImages(true)}>View</button>
          <button onClick={save}>Save</button>
        </div>
      )}
    </section>
  );
}

export default Basic;
