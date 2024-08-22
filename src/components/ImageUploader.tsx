import React, { useMemo, useState } from 'react';

interface FileUploaderProps {
  onFileDrop: (files: File[]) => void;
  acceptedFileTypes?: AcceptedFileKeys[];
}

const AcceptedFileTypes = {
  Image: 'image/*',
  Audio: 'audio/*',
  Video: 'video/*',
};

type AcceptedFileKeys = keyof typeof AcceptedFileTypes;
type AcceptedFileTypes = (typeof AcceptedFileTypes)[keyof typeof AcceptedFileTypes];

const FileUploader: React.FC<FileUploaderProps> = ({ onFileDrop, acceptedFileTypes }) => {
  const [, setDropZoneActive] = useState(false);
  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDropZoneActive(true);
    // if (dropItems) {
    // } else {
    // }
  }
  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const dropItems = Array.from(event.dataTransfer.items);
    const dropFiles = Array.from(event.dataTransfer.files);
    if (dropItems) {
      setDropZoneActive(false);
      processDropItems(dropItems);
    } else {
      setDropZoneActive(false);
      processDropFiles(dropFiles);
    }
  }
  function processDropItems(dropItems: DataTransferItem[]) {
    const files = dropItems
      .filter((item) => item.kind === 'file')
      .map((file) => file.getAsFile())
      .filter((file): file is File => file !== null);

    processDropFiles(files);
  }
  function processDropFiles(dropFiles: File[]) {
    onFileDrop(dropFiles);
  }

  const acceptedFileTypesString = useMemo(() => {
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      return acceptedFileTypes.reduce((acc, type) => {
        const fileType = AcceptedFileTypes[type];
        if (fileType) {
          return `${acc}, ${fileType}`;
        } else return acc;
      }, '');
    }
    return '';
  }, [acceptedFileTypes]);

  return (
    <div
      className="flex aspect-video max-w-lg flex-col items-center justify-center rounded-xl border-2 border-dashed border-default-200 bg-default-100"
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={() => {
        setDropZoneActive(false);
      }}
    >
      {/* <Icon name="upload_2_line" className={classnames(styles.uploadIcon, dropZoneActive && styles.dropZoneActiveColor)} /> */}
      <p className="">Drag and Drop here</p>
      <p className="">or</p>
      <label form="drop-down-input-field" className="cursor-pointer">
        <p className="text-xl font-bold text-primary">Browse Files</p>
        <input
          type="file"
          id="drop-down-input-field"
          className={'hidden'}
          accept={acceptedFileTypesString}
          onChange={(event) => {
            event.preventDefault();
            const files = event.target.files ? Array.from(event.target.files) : [];
            processDropFiles(files);
          }}
        />
      </label>
    </div>
  );
};

export default FileUploader;
