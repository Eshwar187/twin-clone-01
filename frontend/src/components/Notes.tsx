import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, Star, Calendar, Hash, Edit3 } from 'lucide-react';

export const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');
  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  const mockNotes = [
    {
      id: 1,
      title: 'Project Ideas',
      content: 'Digital Doppelgänger concept: AI-powered personal assistant that learns from your habits and helps optimize your lifestyle. Features include health tracking, budget management, and productivity insights.',
      date: '2024-01-15',
      tags: ['project', 'ai', 'health'],
      favorite: true
    },
    {
      id: 2,
      title: 'Daily Reflection - Jan 14',
      content: 'Today was productive. Completed 3 major tasks and maintained good habits. Need to focus more on sleep schedule. Grateful for team support on the new project.',
      date: '2024-01-14',
      tags: ['journal', 'reflection'],
      favorite: false
    },
    {
      id: 3,
      title: 'Meeting Notes - Team Standup',
      content: 'Discussed upcoming deadlines, resource allocation, and sprint planning. Action items: Review design mockups, Update documentation, Schedule client call.',
      date: '2024-01-13',
      tags: ['meeting', 'work'],
      favorite: false
    },
    {
      id: 4,
      title: 'Book Summary - Atomic Habits',
      content: 'Key takeaways: 1% better each day compounds. Focus on systems, not goals. Make good habits obvious, attractive, easy, and satisfying. Environment design is crucial.',
      date: '2024-01-12',
      tags: ['book', 'habits', 'learning'],
      favorite: true
    },
    {
      id: 5,
      title: 'Weekend Plans',
      content: 'Saturday: Gym session, grocery shopping, catch up with friends. Sunday: Meal prep, reading, plan next week. Remember to book dentist appointment.',
      date: '2024-01-11',
      tags: ['personal', 'planning'],
      favorite: false
    }
  ];

  const journalPrompts = [
    "What am I grateful for today?",
    "What did I learn today?",
    "How did I grow as a person?",
    "What challenged me today?",
    "What would make tomorrow better?"
  ];

  const filteredNotes = mockNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Notes & Journal</h1>
          <p className="text-muted-foreground">Capture thoughts, ideas, and daily reflections</p>
        </div>

        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="notes">All Notes</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Notes List */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="glass-card p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="glass-input pl-10"
                      />
                    </div>
                    <Button size="sm" className="neon-button">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredNotes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => setSelectedNote(note.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedNote === note.id
                            ? 'bg-primary/20 border border-primary/50'
                            : 'bg-background/20 hover:bg-background/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-sm line-clamp-1">{note.title}</h3>
                          {note.favorite && <Star className="w-4 h-4 text-warning fill-warning" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {note.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {note.date}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {note.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-1">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Note Editor */}
              <div className="lg:col-span-2">
                <Card className="glass-card p-6 h-full">
                  {selectedNote ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Input
                          value={filteredNotes.find(n => n.id === selectedNote)?.title || ''}
                          className="text-xl font-semibold bg-transparent border-0 px-0 focus-visible:ring-0"
                        />
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {filteredNotes.find(n => n.id === selectedNote)?.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Textarea
                        value={filteredNotes.find(n => n.id === selectedNote)?.content || ''}
                        className="glass-input min-h-96 resize-none"
                        placeholder="Start writing..."
                      />

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Last edited: {filteredNotes.find(n => n.id === selectedNote)?.date}</span>
                        <span>Auto-saved</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                      <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Select a note to edit</h3>
                      <p className="text-muted-foreground">Choose a note from the list or create a new one</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Today's Reflection</h2>
                <Textarea
                  placeholder="How was your day? What are you thinking about?"
                  className="glass-input min-h-48 resize-none"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                  <Button size="sm" className="neon-button">Save Entry</Button>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Journal Prompts</h2>
                <div className="space-y-3">
                  {journalPrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-background/20 cursor-pointer hover:bg-background/30 transition-colors"
                      onClick={() => setNewNote(prompt + '\n\n')}
                    >
                      <p className="text-sm">{prompt}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <h3 className="font-medium mb-3">Recent Entries</h3>
                  <div className="space-y-2">
                    {mockNotes
                      .filter(note => note.tags.includes('journal'))
                      .slice(0, 3)
                      .map((note) => (
                        <div key={note.id} className="flex items-center justify-between text-sm">
                          <span className="line-clamp-1">{note.title}</span>
                          <span className="text-muted-foreground">{note.date}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockNotes
                .filter(note => note.favorite)
                .map((note) => (
                  <Card key={note.id} className="glass-card p-4 cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold line-clamp-1">{note.title}</h3>
                      <Star className="w-4 h-4 text-warning fill-warning" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};