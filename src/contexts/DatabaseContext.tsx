import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Student {
  id: string;
  name: string;
  email: string;
  voiceProfile: string;
  registrationDate: string;
}

interface Session {
  id: string;
  studentId: string;
  studentName: string;
  startTime: string;
  endTime?: string;
  headMovements: number;
  phoneDetections: number;
  cheatingPercentage: number;
  trustScore: number;
  status: 'active' | 'completed' | 'flagged';
}

interface DatabaseContextType {
  students: Student[];
  sessions: Session[];
  addStudent: (student: Omit<Student, 'id' | 'registrationDate'>) => void;
  getStudent: (name: string) => Student | undefined;
  addSession: (session: Omit<Session, 'id'>) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  getStudentSessions: (studentId: string) => Session[];
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      voiceProfile: 'voice_profile_1',
      registrationDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      voiceProfile: 'voice_profile_2',
      registrationDate: '2024-01-16'
    }
  ]);

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      studentId: '1',
      studentName: 'John Doe',
      startTime: '2024-01-20T10:00:00Z',
      endTime: '2024-01-20T11:30:00Z',
      headMovements: 15,
      phoneDetections: 2,
      cheatingPercentage: 25,
      trustScore: 75,
      status: 'completed'
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Jane Smith',
      startTime: '2024-01-20T14:00:00Z',
      endTime: '2024-01-20T15:30:00Z',
      headMovements: 8,
      phoneDetections: 0,
      cheatingPercentage: 10,
      trustScore: 90,
      status: 'completed'
    }
  ]);

  const addStudent = (studentData: Omit<Student, 'id' | 'registrationDate'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const getStudent = (name: string) => {
    return students.find(student => student.name.toLowerCase() === name.toLowerCase());
  };

  const addSession = (sessionData: Omit<Session, 'id'>) => {
    const newSession: Session = {
      ...sessionData,
      id: Date.now().toString()
    };
    setSessions(prev => [...prev, newSession]);
  };

  const updateSession = (id: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(session => 
      session.id === id ? { ...session, ...updates } : session
    ));
  };

  const getStudentSessions = (studentId: string) => {
    return sessions.filter(session => session.studentId === studentId);
  };

  return (
    <DatabaseContext.Provider value={{
      students,
      sessions,
      addStudent,
      getStudent,
      addSession,
      updateSession,
      getStudentSessions
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};