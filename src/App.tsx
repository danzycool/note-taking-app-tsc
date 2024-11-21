import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react"
import { Container } from 'react-bootstrap'
import { Routes, Route, Navigate } from 'react-router-dom'
import { v4 as uuidV4 } from "uuid"

import { useLocalStorage } from './services/useLocalStorage'
import NewNote from './pages/NewNote'
import Home from "./pages/Home"
import NoteLayout from "./components/NoteLayout"
import Note from "./pages/Note"
import EditNote from "./pages/EditNote"

export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type NoteData = {
  title: string,
  markdown: string,
  tags: Tag[]
}

export type RawNoteData = {
  title: string,
  markdown: string,
  tagIds: string[]
}

export type Tag = {
  id: string,
  label: string
}

export type SimplifiedNote = {
  id: string
  title: string
  tags: Tag[]
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  }, [notes, tags])

  function onCreateNote({tags, ...data}: NoteData) {
    setNotes(prevNotes => {
      return [
        ...prevNotes, 
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }
      ]
    })
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
  }

  function onUpdateNote(id: string, {tags, ...data}: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if(note.id === id) {
            return { ...note, ...data, tagIds: tags.map(tag => tag.id)}
        }else {
          return note
        }
      })
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function onUpdateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if(tag.id === id) {
            return { ...tag, label }
        }else {
          return tag
        }
      })
    })
  }

  function onDeleteTag(id: string) {
    setTags(prevTags => prevTags.filter(tag => tag.id !== id))
  }
  
  return (
    <Container className='my-4'>
      <Routes>
        <Route 
          path='/' 
          element={ 
            <Home 
              availableTags={tags} 
              notes={notesWithTags} 
              onUpdateTag={onUpdateTag}
              onDeleteTag={onDeleteTag}
            /> 
          }
        />
        <Route 
          path='/New' 
          element={ 
            <NewNote 
              onSubmit={onCreateNote} 
              onAddTag = {addTag}
              availableTags={tags}
            /> 
          } 
        />
        <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={ <Note onDelete={onDeleteNote} /> } />
          <Route 
            path='edit' 
            element={ 
              <EditNote 
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              /> 
            } 
          />
        </Route>
        <Route path='*' element={ <Navigate to="/" /> }/>
      </Routes>
    </Container>
  )
}

export default App;
