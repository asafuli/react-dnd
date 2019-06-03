import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

class App extends Component {
  state = initialData;

  handleDragEnd = ({ destination, source, draggableId }) => {
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = this.state.columns[source.droppableId];
    const newTaskIds = [...column.taskIds];
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);
    const newColumn = { ...column, taskIds: newTaskIds };
    const newState = {
      ...this.state,
      columns: { ...this.state.columns, [newColumn.id]: newColumn }
    };
    this.setState(newState);
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        {this.state.columnOrder.map(columnId => {
          const column = this.state.columns[columnId];
          const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </DragDropContext>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
