import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  background-color: white;
  width: 220px;

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  paddind: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease
  background-color: ${props =>
    props.isDraggingOver ? 'lightblue' : 'inherit'};
  
  flex-grow: 1;
  min-height: 100px

`;

const Column = props => {
  return (
    <Draggable draggableId={props.column.id} index={props.index}>
      {provided => (
        <Container {...provided.draggableProps} ref={provided.innerRef}>
          <Title {...provided.dragHandleProps}>{props.column.title}</Title>
          <Droppable droppableId={props.column.id} type='task'>
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {props.tasks.map((task, idx) => (
                  <Task key={task.id} task={task} index={idx} />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
