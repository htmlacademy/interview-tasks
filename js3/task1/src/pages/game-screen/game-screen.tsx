import {Navigate, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {incrementStep, checkUserAnswer} from '../../store/game-process/game-process';
import {AppRoute, GameType, MAX_MISTAKE_COUNT} from '../../const';
import ArtistQuestionScreen from '../artist-question-screen/artist-question-screen';
import GenreQuestionScreen from '../genre-question-screen/genre-question-screen';
import Mistakes from '../../components/mistakes/mistakes';
import {QuestionArtist, QuestionGenre, Question, UserAnswer} from '../../types/question';
import withAudioPlayer from '../../hocs/with-audio-player/with-audio-player';
import {getMistakeCount, getStep} from '../../store/game-process/selectors';
import {getQuestions, getQuestionsType} from '../../store/game-data/selectors';
import { useEffect } from 'react';

const ArtistQuestionScreenWrapped = withAudioPlayer(ArtistQuestionScreen);
const GenreQuestionScreenWrapped = withAudioPlayer(GenreQuestionScreen);

function GameScreen(): JSX.Element {
  const navigate = useNavigate();
  const step = useAppSelector(getStep);
  const mistakes = useAppSelector(getMistakeCount);
  const questionsType = useAppSelector(getQuestionsType);
  const questions = useAppSelector(getQuestions).filter(q => !questionsType || q.type === questionsType);

  const question = questions[step];

  const dispatch = useAppDispatch();

  if (mistakes >= MAX_MISTAKE_COUNT) {
    return <Navigate to={AppRoute.Lose} />;
  }

  if (step >= questions.length || !question) {
    return <Navigate to={AppRoute.Result} />;
  }

  useEffect(() => {
    document.addEventListener('keydown', () => {
      navigate('/');
    });
  }, []);

  const onUserAnswer = (questionItem: Question, userAnswer: UserAnswer) => {
    dispatch(incrementStep());
    dispatch(checkUserAnswer({question: questionItem, userAnswer}));
  };

  switch (question.type) {
    case GameType.Artist:
      return (
        <ArtistQuestionScreenWrapped
          key={step}
          question={question as QuestionArtist}
          onAnswer={onUserAnswer}
        >
          <Mistakes count={mistakes} />
        </ArtistQuestionScreenWrapped>
      );
    case GameType.Genre:
      return (
        <GenreQuestionScreenWrapped
          key={step}
          question={question as QuestionGenre}
          onAnswer={onUserAnswer}
        >
          <Mistakes count={mistakes} />
        </GenreQuestionScreenWrapped>
      );
    default:
      return <Navigate to={AppRoute.Root} />;
  }
}

export default GameScreen;
