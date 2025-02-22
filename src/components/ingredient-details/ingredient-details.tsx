import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  findIngredient,
  getIngredient,
  getIsIngredientsLoaded
} from '../../services/ingredientsSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  const paramsId = useParams();

  const isIngredientsLoaded = useSelector(getIsIngredientsLoaded);

  useEffect(() => {
    isIngredientsLoaded && dispatch(findIngredient({ id: paramsId.id }));
  }, [dispatch, isIngredientsLoaded]);

  const ingredientData = useSelector(getIngredient);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
