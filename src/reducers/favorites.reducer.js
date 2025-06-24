const initialState = {
  favoriteList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

const actions = {
  fetchFavorites: 'fetchFavorites',
  loadFavorites: 'loadFavorites',
  setLoadError: 'setLoadError',
  clearError: 'clearError',
  startRequest: 'startRequest',
  endRequest: 'endRequest',
  addFavorite: 'addFavorite',
  updateFavorite: 'updateFavorite',
  deleteFavorite: 'deleteFavorite',
  revertFavorite: 'revertFavorite',
  reorderFavorites: 'reorderFavorites',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchFavorites:
      return {
        ...state,
        isLoading: true,
      };

    case actions.loadFavorites:
      return {
        ...state,
        favoriteList: action.records
          .map((record) => ({
            id: record.id,
            title: record.fields.title,
            category: record.fields.category,
            order: record.fields.order ?? 9999,
          }))
          .sort((a, b) => a.order - b.order),
        isLoading: false,
      };

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };

    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };

    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    case actions.addFavorite: {
      const savedFavorite = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };

      return {
        ...state,
        favoriteList: [...state.favoriteList, savedFavorite],
        isSaving: false,
      };
    }

    case actions.updateFavorite: {
      const updatedFavorites = state.favoriteList.map((favorite) =>
        favorite.id === action.updatedFavorite.id
          ? { ...action.updatedFavorite }
          : favorite
      );

      const updatedState = {
        ...state,
        favoriteList: [...updatedFavorites],
      };

      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }

      return {
        ...updatedState,
      };
    }

    case actions.deleteFavorite: {
      const updatedFavorites = state.favoriteList.filter(
        (item) => item.id !== action.id
      );

      return {
        ...state,
        favoriteList: updatedFavorites,
      };
    }

    case actions.revertFavorite: {
      const revertedList = state.favoriteList.map((favorite) =>
        favorite.id === action.originalFavorite.id
          ? { ...action.originalFavorite }
          : favorite
      );

      const revertedState = {
        ...state,
        favoriteList: [...revertedList],
      };

      if (action.error) {
        revertedState.errorMessage = action.error.message;
      }

      return {
        ...revertedState,
      };
    }

    case actions.reorderFavorites: {
      const { fromIndex, toIndex } = action;
      const updated = [...state.favoriteList];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);

      const reordered = updated.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      return {
        ...state,
        favoriteList: reordered,
      };
    }

    default:
      return state;
  }
}

export { reducer, initialState, actions };
