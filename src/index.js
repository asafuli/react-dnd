import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

const Container = styled.div`
  display: flex;
`;

class App extends Component {
  state = initialData;

  handleDragEnd = ({ destination, source, draggableId, type }) => {
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Dragging a column
    if (type === 'column') {
      const newColumnOrder = [...this.state.columnOrder];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      const newState = { ...this.state, columnOrder: newColumnOrder };
      this.setState(newState);
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    //Dragging in between the same column

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
    }
    // Dragging between different columns
    else {
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
        <Droppable
          droppableId='all-columns'
          direction='horizontal'
          type='column'
        >
          {provided => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {this.state.columnOrder.map((columnId, index) => {
                const column = this.state.columns[columnId];
                const tasks = column.taskIds.map(
                  taskId => this.state.tasks[taskId]
                );
                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
