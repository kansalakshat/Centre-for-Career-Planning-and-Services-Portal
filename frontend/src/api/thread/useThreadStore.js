import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { useState } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const useThreadStore = () => {
    const [loading, setLoading] = useState(false);
    const { backendUrl } = useAppContext();
    const token = localStorage.getItem('ccps-token');

    const { data, refetch } = useQuery({
        queryKey: ['threads'],
        queryFn: async () => {
            const res = await fetch(`${backendUrl}/api/threads/getThreads`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data.threads;
        }
    });

    const threads = data || [];

    const createThreadMutation = useMutation({
        mutationFn: async (threadData) => {
            const res = await fetch(`${backendUrl}/api/threads/createThread`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(threadData)
            });

            if (!res.ok) {
                throw new Error(`Request failed with status: ${res.status}`);
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || "Unknown error");
            }

            return data;
        }
    });

    const createThread = async (threadData) => {
        const success = handleInputError(threadData);
        if (!success) return;

        if (threadData.file) {
            threadData.file = await convertToBase64(threadData.file);
        }

        setLoading(true);
        try {
            await createThreadMutation.mutateAsync(threadData);
            refetch();
            toast.success("Thread created!");
            return true;
        } catch (error) {
            console.error("Error creating thread:", error);
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const createCommentMutation = useMutation({
        mutationFn: async (commentData) => {
            const res = await fetch(`${backendUrl}/api/threads/createComment/${commentData.threadId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(commentData)
            });

            if (!res.ok) {
                throw new Error(`Request failed with status: ${res.status}`);
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || "Unknown error");
            }

            return data;
        }
    });

    const createComment = async (commentData) => {
        const success = handleInputError1(commentData);
        if (!success) return;

        if (commentData.file) {
            commentData.file = await convertToBase64(commentData.file);
        }

        setLoading(true);
        try {
            await createCommentMutation.mutateAsync(commentData);
            refetch();
            toast.success("Comment added!");
            return true;
        } catch (error) {
            console.error("Error creating comment:", error);
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleThreadVoteMutation = useMutation({
        mutationFn: async ({ threadId, voteType }) => {
            const res = await fetch(`${backendUrl}/api/threads/vote/${threadId}`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ voteType }) 
            });

            let data = {};
            if (res.ok) {
                data = await res.json();
            } else {
                try {
                    data = await res.json();
                } catch (e) {
                    throw new Error(data.message || `Server error (Status: ${res.status}). Route not found on server.`); 
                }
            }

            if (!res.ok) {
                throw new Error(data.message || res.statusText); 
            }

            return data.updatedThread;
        }
    });

    const handleThreadVote = async (threadId, voteType) => {
        try {
            const updatedThread = await handleThreadVoteMutation.mutateAsync({ threadId, voteType });
            return updatedThread;
        } catch (error) {
            console.error("Error voting on thread:", error);
            throw error; 
        }
    };

    return { 
        loading, 
        threads, 
        getThreads: refetch, 
        createThread, 
        createComment, 
        handleThreadVote 
    };
}

function handleInputError({ title, text }) {
    if (!title || !text) {
        toast.error('Fill out the required fields');
        return false;
    }
    return true;
}

function handleInputError1({ text, file, threadId }) {
    if (!text && !file) {
        toast.error('Empty comment');
        return false;
    }
    if (!threadId) {
        toast.error('Thread not found');
        return false;
    }
    return true;
}

export default useThreadStore;