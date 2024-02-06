import { ChangeEvent, useState, useEffect } from "react";
import logo from "./assets/logo.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import { toast } from "sonner";
import { ThumbsDown, Undo2Icon } from "lucide-react";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] =
    useState(false);

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

      SpeechRecognitionAPI ? setIsSpeechRecognitionSupported(true) : setIsSpeechRecognitionSupported(false);
   
  }, []);

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => note.id !== id);

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));

    toast.success("Nota excluída com sucesso!");
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto mx-w-auto my-10 space-y-6">
      <div className="flex flex-col justify-center items-center gap-6 ">
        <img src={logo} alt="logo" className="hover:scale-110 transition" />
        {isSpeechRecognitionSupported && (
            <form className="w-full">
            <input
              type="text"
              placeholder="Busque em suas notas"
              className="w-full h-12 p-4 bg-transparent text-xl text-semi-bold tracking-tight focus:outline-none placeholder:text-slate-500"
              onChange={handleSearch}
            />
          </form>
        )}
        <div className="h-px w-full bg-slate-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 auto-rows-[250px] gap-6 py-6 px-5">
        {isSpeechRecognitionSupported ? (
          <NewNoteCard onNoteCreated={onNoteCreated} />
        ) : (
          <div className="col-span-3 flex justify-center gap-4">
            <span className="text-gray-400 text-sm font-bold">
              Infelizmente, o seu navegador não oferece suporte ao
              reconhecimento de fala.
            </span>
          </div>
        )}
        {filteredNotes.map((note) => (
          <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
