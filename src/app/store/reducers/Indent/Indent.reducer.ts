import { IIndent } from "app/models/interfaces/indent.interface";
import { CustomActions } from "app/store/customActions";

export interface IndentState {
  indentList: IIndent[];
}

const initialState: IndentState = {
    indentList: []
};


export function IndentReducer(state: IndentState = initialState, action: CustomActions): IndentState {
  switch (action.type) {
    default: {
    return state;
    }
  }
}