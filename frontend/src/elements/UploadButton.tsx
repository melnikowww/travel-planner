import {useState} from "react";
import axios from 'axios'

function Upload() {
    const [_, setMessage] = useState("");
    const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "");


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) {
            setMessage("Please select a file first.");
            return;
        }
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post("http://localhost:8081/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            await axios.patch("http://localhost:8081/users?id=" + localStorage.getItem("id"),
                `{"imageSrc":"/src/uploads/avatar_` + localStorage.getItem("id") + `.jpg"}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                })

            const newAvatarUrl = `/src/uploads/avatar_${localStorage.getItem("id")}.jpg`;
            setAvatar(newAvatarUrl);
            localStorage.setItem("avatar", newAvatarUrl);
            setMessage(response.data.message);
            window.location.reload()
        } catch (error) {
            setMessage("Failed to upload the file.");
            console.error(error);
        }
    };

    return (
        <div className="text-center">
            <input
                type="file"
                id="fileInput"
                style={{display: "none"}}
                onChange={handleFileChange}
            />
            <label
                htmlFor="fileInput"
                className="rounded-circle avatar"
                style={{
                    cursor: "pointer",
                    backgroundImage: `url(${avatar})`,
                    boxShadow: "0 0px 12px rgba(0,0,0,0.7)",
                }}
            >
                <i className="bi bi-upload fs-3"></i>
            </label>
        </div>
    )
}

export default Upload;