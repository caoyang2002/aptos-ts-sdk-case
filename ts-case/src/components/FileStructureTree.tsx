import React, { useState, useEffect } from 'react'
import { Folder, File, Trash2, Plus, FolderPlus } from 'lucide-react'

type FileItem = string
type FolderItem = { [key: string]: FileStructure }
export type FileStructure = Array<FileItem | FolderItem>

interface FileTreeProps {
  files: FileStructure
  onAddFile: (path: string[]) => void
  onAddFolder: (path: string[]) => void
  onDeleteItem: (path: string[]) => void
  onSelectItem: (path: string[]) => void
  path?: string[]
  allowEdit: boolean
}

const FileTree: React.FC<FileTreeProps> = ({
  files,
  onAddFile,
  onAddFolder,
  onDeleteItem,
  onSelectItem,
  path = [],
  allowEdit,
}) => {
  const [newItemName, setNewItemName] = useState<string>('')

  const handleAddFile = () => {
    if (newItemName) {
      onAddFile([...path, newItemName])
      setNewItemName('')
    }
  }

  const handleAddFolder = () => {
    if (newItemName) {
      onAddFolder([...path, newItemName])
      setNewItemName('')
    }
  }

  return (
    <ul className="pl-4">
      {files.map((item, index) => (
        <li key={index} className="mb-2">
          {typeof item === 'string' ? (
            <div className="flex items-center">
              <File className="w-4 h-4 mr-2 text-blue-500" />
              <span
                className="text-white cursor-pointer hover:underline hover:text-blue-500"
                onClick={() => onSelectItem([...path, item])}
              >
                {item}
              </span>
              {allowEdit && (
                <button
                  onClick={() => onDeleteItem([...path, item])}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-2">
                <Folder className="w-4 h-4 mr-2 text-yellow-500" />
                <span
                  className="text-white font-bold cursor-pointer hover:underline hover:text-yellow-500"
                  onClick={() => onSelectItem([...path, Object.keys(item)[0]])}
                >
                  {Object.keys(item)[0]}
                </span>
                {allowEdit && (
                  <button
                    onClick={() =>
                      onDeleteItem([...path, Object.keys(item)[0]])
                    }
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <FileTree
                files={Object.values(item)[0]}
                onAddFile={onAddFile}
                onAddFolder={onAddFolder}
                onDeleteItem={onDeleteItem}
                onSelectItem={onSelectItem}
                path={[...path, Object.keys(item)[0]]}
                allowEdit={allowEdit}
              />
            </div>
          )}
        </li>
      ))}
      {allowEdit && (
        <li>
          <div className="flex items-center">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="New item name"
              className="bg-gray-700 text-white px-2 py-1 rounded mr-2"
            />
            <button
              onClick={handleAddFile}
              className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded mr-2"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddFolder}
              className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
        </li>
      )}
    </ul>
  )
}

interface FileStructureTreeProps {
  initialFiles: FileStructure
  initialFileContents: [string, string][]
  onUpdate: (files: FileStructure, selectedPath?: string[]) => void
  allowEdit: boolean
}

const FileStructureTree: React.FC<FileStructureTreeProps> = ({
  initialFiles,
  initialFileContents,
  onUpdate,
  allowEdit,
}) => {
  const [files, setFiles] = useState<FileStructure>(initialFiles)
  const [fileContents, setFileContents] = useState<Record<string, string>>({})
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  // Update file contents
  useEffect(() => {
    const contents: Record<string, string> = {}
    initialFileContents.forEach(([filename, content]) => {
      contents[filename] = content
    })
    setFileContents(contents)
    if (selectedFile)
      console.log(fileContents[selectedFile], ' 文件内容：', fileContents)
  }, [initialFileContents])

  // Update file structure
  useEffect(() => {
    setFiles(initialFiles)
  }, [initialFiles])

  const updateFiles = (newFiles: FileStructure) => {
    setFiles(newFiles)
    onUpdate(newFiles)
  }

  const addFile = (path: string[]) => {
    if (!allowEdit) return
    const newFiles = [...files]
    let current: FileStructure = newFiles
    for (let i = 0; i < path.length - 1; i++) {
      const folder = current.find(
        (item): item is FolderItem =>
          typeof item === 'object' && Object.keys(item)[0] === path[i]
      )
      if (folder) {
        current = folder[path[i]]
      } else {
        throw new Error('Path not found')
      }
    }
    ;(current as FileStructure).push(path[path.length - 1])
    updateFiles(newFiles)
  }

  const addFolder = (path: string[]) => {
    if (!allowEdit) return
    const newFiles = [...files]
    let current: FileStructure = newFiles
    for (let i = 0; i < path.length - 1; i++) {
      const folder = current.find(
        (item): item is FolderItem =>
          typeof item === 'object' && Object.keys(item)[0] === path[i]
      )
      if (folder) {
        current = folder[path[i]]
      } else {
        throw new Error('Path not found')
      }
    }
    ;(current as FileStructure).push({ [path[path.length - 1]]: [] })
    updateFiles(newFiles)
  }

  const deleteItem = (path: string[]) => {
    if (!allowEdit) return
    if (confirm('Are you sure you want to delete ' + path.join('/') + '?')) {
      const newFiles = [...files]
      let current: FileStructure = newFiles
      for (let i = 0; i < path.length - 1; i++) {
        const folder = current.find(
          (item): item is FolderItem =>
            typeof item === 'object' && Object.keys(item)[0] === path[i]
        )
        if (folder) {
          current = folder[path[i]]
        } else {
          throw new Error('Path not found')
        }
      }
      const index = (current as FileStructure).findIndex((item) =>
        typeof item === 'string'
          ? item === path[path.length - 1]
          : Object.keys(item)[0] === path[path.length - 1]
      )
      if (index !== -1) {
        ;(current as FileStructure).splice(index, 1)
      }
      updateFiles(newFiles)
      if (selectedFile === path.join('/')) {
        setSelectedFile(null)
      }
    }
  }

  const selectItem = (path: string[]) => {
    const fullPath = path.join('/')
    console.log('Selected item path:', fullPath)
    setSelectedFile(fullPath)
    console.log('Selected file content:', fileContents[path[path.length - 1]])
    onUpdate(files, path)
  }

  useEffect(() => {
    if (selectedFile) {
      console.log('Selected file:', selectedFile)
      console.log('File content:', fileContents[selectedFile])
    }
  }, [selectedFile, fileContents])

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-white">项目结构</h2>

      <div className="mb-4">
        <FileTree
          files={files}
          onAddFile={addFile}
          onAddFolder={addFolder}
          onDeleteItem={deleteItem}
          onSelectItem={selectItem}
          allowEdit={allowEdit}
        />
      </div>
      <div className="my-4">
        <h2 className="text-xl font-bold  text-white">文件详情</h2>
        {selectedFile ? (
          <pre className="bg-gray-800 m-1 p-1 rounded overflow-auto max-h-72">
            {fileContents[selectedFile] || '没有查询到文件内容'}
          </pre>
        ) : (
          <p className="text-white">点击任意文件以查看内容</p>
        )}
      </div>
    </>
  )
}

export default FileStructureTree
