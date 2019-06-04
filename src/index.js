import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

const Container = styled.div`
  display: flex;
`;

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

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const column = start;
      const newTaskIds = [...column.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...column, taskIds: newTaskIds };
      const newState = {
        ...this.state,
        columns: { ...this.state.columns, [newColumn.id]: newColumn }
      };
      this.setState(newState);
    } else {
      const newStartTaskIds = [...start.taskIds];
      const newFinishTaskIds = [...finish.taskIds];
      newStartTaskIds.splice(source.index, 1);
      newFinishTaskIds.splice(destination.index, 0, draggableId);
      const newStart = { ...start, taskIds: newStartTaskIds };
      const newFinish = { ...finish, taskIds: newFinishTaskIds };
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      };
      this.setState(newState);
    }
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <Container>
          {this.state.columnOrder.map(columnId => {
            const column = this.state.columns[columnId];
            const tasks = column.taskIds.map(
              taskId => this.state.tasks[taskId]
            );
            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </Container>
      </DragDropContext>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
