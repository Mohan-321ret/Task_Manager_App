import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView
} from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const addTask = () => {
    if (task.trim() === '') return;

    setTasks([
      ...tasks,
      { 
        id: Date.now().toString(), 
        title: task, 
        completed: false,
        dueDate: dueDate || null,
        dueTime: dueTime || null
      }
    ]);

    setTask('');
    setDueDate('');
    setDueTime('');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map(item =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const isOverdue = (task) => {
    if (!task.dueDate && !task.dueTime) return false;
    if (task.completed) return false;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    if (task.dueDate && task.dueDate < today) return true;
    if (task.dueDate === today && task.dueTime && task.dueTime < currentTime) return true;
    
    return false;
  };

  const formatDueInfo = (task) => {
    if (!task.dueDate && !task.dueTime) return null;
    
    let dueText = '';
    if (task.dueDate) dueText += task.dueDate;
    if (task.dueTime) dueText += (dueText ? ' at ' : '') + task.dueTime;
    
    return dueText;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>✓</Text>
          </View>
          <Text style={styles.appName}>TaskFlow</Text>
        </View>
        <Text style={styles.slogan}>Organize today. Achieve tomorrow.</Text>
      </View>

      {/* Task Input Section */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#9ca3af"
          value={task}
          onChangeText={setTask}
        />
        
        <View style={styles.dateTimeRow}>
          <TextInput
            style={[styles.input, styles.dateInput]}
            placeholder="Due date"
            placeholderTextColor="#9ca3af"
            value={dueDate}
            onChangeText={setDueDate}
          />
          <TextInput
            style={[styles.input, styles.timeInput]}
            placeholder="Time"
            placeholderTextColor="#9ca3af"
            value={dueTime}
            onChangeText={setDueTime}
          />
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <View style={styles.taskListContainer}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tasks yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first task above</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.taskCard, 
                  item.completed && styles.taskCardCompleted,
                  isOverdue(item) && styles.taskCardOverdue
                ]} 
                onPress={() => toggleTask(item.id)}
              >
                <View style={styles.taskContent}>
                  <View style={[styles.checkbox, item.completed && styles.checkboxCompleted]}>
                    {item.completed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
                      {item.title}
                    </Text>
                    {formatDueInfo(item) && (
                      <Text style={[
                        styles.dueText, 
                        isOverdue(item) && styles.dueTextOverdue,
                        item.completed && styles.dueTextCompleted
                      ]}>
                        Due: {formatDueInfo(item)}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  slogan: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateInput: {
    flex: 2,
    marginBottom: 0,
  },
  timeInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  taskListContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  taskCardCompleted: {
    backgroundColor: '#f9fafb',
    opacity: 0.8,
  },
  taskCardOverdue: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  taskInfo: {
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 22,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  dueText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  dueTextOverdue: {
    color: '#ef4444',
    fontWeight: '500',
  },
  dueTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
});
