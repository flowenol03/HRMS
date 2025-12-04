import { useState, useCallback } from 'react';
import { dbService } from '../firebase/firebaseService';

export const useFirebase = (path) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dbService.getAll(path);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [path]);

  const create = useCallback(async (item) => {
    setLoading(true);
    try {
      const result = await dbService.create(path, item);
      await fetchData();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [path, fetchData]);

  const update = useCallback(async (id, updates) => {
    setLoading(true);
    try {
      await dbService.update(`${path}/${id}`, updates);
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [path]);

  const remove = useCallback(async (id) => {
    setLoading(true);
    try {
      await dbService.delete(`${path}/${id}`);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [path]);

  const query = useCallback(async (field, value) => {
    setLoading(true);
    try {
      const result = await dbService.query(path, field, value);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [path]);

  return {
    data,
    loading,
    error,
    fetchData,
    create,
    update,
    remove,
    query
  };
};