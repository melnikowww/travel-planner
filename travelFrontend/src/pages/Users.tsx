import { useEffect, useState } from 'react';
import axios from 'axios';
// import {useNavigate} from "react-router-dom";
import {User} from "../../types.ts";

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get<User[]>('http://localhost:8081/users');
                setUsers(response.data);
                setError('');
            } catch (err) {
                setError('Ошибка при загрузке пользователей');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Список пользователей</h2>
            <div className="user-list">
                {users.map((user) => (
                    <div key={user.id} className="user-card">
                        <h3>{user.name}</h3>
                        <p>Автомобили: {user.cars?.map((car)=> (
                            <li key={car.id}>{car.name}</li>
                        )) || 0}</p>
                        <p>Участвует в командах: {user.crews?.length || 0}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;
