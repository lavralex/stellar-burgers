import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  getFeeds,
  getFeedsLoading
} from '../../services/slices/feeds-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeeds);
  const isLoading = useSelector(getFeedsLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
