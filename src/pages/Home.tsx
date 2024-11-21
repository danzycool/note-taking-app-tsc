import NoteList from '../components/NoteList'
import { Tag, SimplifiedNote } from '../App'
import { NoteListProps } from '../components/NoteList'

const Home = ({ availableTags, notes, onDeleteTag, onUpdateTag }: NoteListProps) => {
  return (
    <>
        <h1>Welcome... </h1>
        <hr />
        <br />
        <NoteList 
          availableTags={ availableTags } 
          notes={ notes } 
          onDeleteTag={ onDeleteTag } 
          onUpdateTag={ onUpdateTag } 
        />
    </>
  )
}

export default Home