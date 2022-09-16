import {NameSpace} from '../../const';
import {State} from '../../types/state';
import {Questions} from '../../types/question';

export const getQuestionsType = (state: State): string | undefined => state[NameSpace.Data].questionType;
export const getQuestions = (state: State): Questions => state[NameSpace.Data].questions;
export const getLoadedDataStatus = (state: State): boolean => state[NameSpace.Data].isDataLoaded;
