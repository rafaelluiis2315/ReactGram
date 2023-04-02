import './EditProfile.css';
import { uploads } from '../../utils/config';

// Hooks
import { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Redux
import { profile, updateProfile, resetMessage } from '../../slices/userSlice';

// Components
import Message from '../../components/Message';

const EditProfile = () => {
    const dispatch = useDispatch();
    const { user, message, error, loading } = useSelector((state) => state.user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [bio, setBio] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    // Load user data
    useLayoutEffect(() => {
        dispatch(profile());
    }, [dispatch]);

    // Fill from with user data
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setBio(user.bio);
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Gather user data from states
        const userData = {
            name
        }

        if (profileImage) {
            userData.profileImage = profileImage
        }

        if (bio) {
            userData.bio = bio
        }

        if (password) {
            userData.password = password
        }

        console.log("userData >>>", userData);
        // Build form data
        const formData = new FormData()

        const userFormData = Object.keys(userData).forEach((key) => formData.append(key, userData[key]));

        formData.append(user, userFormData);

        await dispatch(updateProfile(formData));

        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    }

    const handleFile = (e) => {
        // image preview
        const image = e.target.files[0]

        setPreviewImage(image);

        // update image state
        setProfileImage(image);
    }

    console.log(user)
    return (
        <div id='edit-profile'>
            <h2>Edite seus dados</h2>
            <p className="subtitle">Adicione uma imagem de perfil, e conte mais um pouco sobre você...</p>
            {(user.profileImage || previewImage) && (
                <img
                    className='profile-image'
                    src={
                        previewImage ? URL.createObjectURL(previewImage) : `${uploads}/users/${user.profileImage}`
                    }
                    alt={`Foto de ${user.name}`}
                />
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='Nome'
                    onChange={(e) => setName(e.target.value)}
                    value={name || ""}
                />
                <input
                    type="email"
                    placeholder='E-mail'
                    disabled
                    value={email || ""}
                />
                <label>
                    <span>Imagem do Perfil:</span>
                    <input type="file" onChange={handleFile} />
                </label>
                <label>
                    <span>Bio:</span>
                    <textarea
                        rows="4"
                        cols="50"
                        placeholder='Descrição do perfil'
                        onChange={(e) => setBio(e.target.value)}
                        value={bio || ""}
                    ></textarea>
                </label>
                <label>
                    <span>Quer alterar sua senha?</span>
                    <input
                        type="password"
                        placeholder='Digite sua nova senha'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password || ""}
                    />
                </label>
                {!loading && <input type="submit" value="Atualizar" />}
                {loading && <input type="submit" disabled value="Aguarde.." />}
                {error && <Message msg={error} type="error" />}
                {message && !error ? <Message msg={message} type="success" /> : null}
            </form>
        </div>
    )
}

export default EditProfile;