import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
    GetUserById,
    LogginOfUser,
    RegistrationOfUser,
    UpdateOfUser,
    getUsers,
    loggedInUser,
    LoginPayload,
    LoginResponse,
    User,
} from "../Apis/users.actions";

interface AuthState {
    user: User | null;
    users: User[];
    isLoading: boolean;
    adminToken: string;
    seller: User | null;
    isLoggedIn: boolean;
}

const initialState: AuthState = {
    user: null,
    users: [],
    isLoading: false,
    adminToken: localStorage.getItem("adminToken") || "",
    seller: null,
    isLoggedIn: !!localStorage.getItem("adminToken"),
};

const getErrorMessage = (payload: unknown, fallback: string) =>
    typeof payload === "string" ? payload : fallback;

export const getLoggedInUser = createAsyncThunk<
    User | null,
    void,
    { rejectValue: string }
>("auth/getLoggedInUser", async (_, thunkAPI) => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
        return null;
    }

    try {
        const data = await loggedInUser();
        return data?.Data ?? null;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(
            error?.response?.data?.message || "Failed to fetch logged in user"
        );
    }
});

export const RegisteringUser = createAsyncThunk<
    any,
    any,
    { rejectValue: string }
>("auth/registeringUser", async (formData, thunkAPI) => {
    try {
        return await RegistrationOfUser(formData);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(
            error?.response?.data?.message || "Registration failed"
        );
    }
});

export const LoggingUser = createAsyncThunk<
    LoginResponse,
    LoginPayload,
    { rejectValue: string }
>("auth/logginguser", async (formData, thunkAPI) => {
    try {
        const data = await LogginOfUser(formData);

        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("loggedIn", "true");

        return data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(
            error?.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
    }
});

export const GettingUserById = createAsyncThunk<
    User,
    string,
    { rejectValue: string }
>("auth/gettinguserbyid", async (id, thunkAPI) => {
    try {
        const data = await GetUserById(id);
        return data.Data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(
            error?.response?.data?.message || "Failed to fetch user"
        );
    }
});

export const UpdattingOfUser = createAsyncThunk<
    User,
    { userid: string; formData: any },
    { rejectValue: string }
>("auth/updatingofuser", async ({ userid, formData }, thunkAPI) => {
    try {
        const data = await UpdateOfUser(userid, formData);
        return data.Data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(
            error?.response?.data?.message || "Failed to update user"
        );
    }
});

export const getAllUsers = createAsyncThunk<
    User[],
    void,
    { rejectValue: string }
>("auth/getallusers", async (_, thunkAPI) => {
    try {
        const data = await getUsers();
        return data.users ?? [];
    } catch (error: any) {
        return thunkAPI.rejectWithValue(
            error?.response?.data?.message || "Failed to fetch users"
        );
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.adminToken = "";
            state.isLoggedIn = false;
            localStorage.removeItem("adminToken");
            localStorage.removeItem("loggedIn");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLoggedInUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLoggedInUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getLoggedInUser.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(getErrorMessage(action.payload, "Failed to fetch user"));
            })

            .addCase(RegisteringUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(RegisteringUser.fulfilled, (state) => {
                state.isLoading = false;
                toast.success("Registration successful");
            })
            .addCase(RegisteringUser.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(getErrorMessage(action.payload, "Registration failed"));
            })

            .addCase(LoggingUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(LoggingUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.adminToken = action.payload.token;
                state.isLoggedIn = true;
                toast.success(action.payload.message || "Login successful");
            })
            .addCase(LoggingUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = false;
                toast.error(getErrorMessage(action.payload, "Login failed"));
            })

            .addCase(GettingUserById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(GettingUserById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.seller = action.payload;
            })
            .addCase(GettingUserById.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(getErrorMessage(action.payload, "Failed to fetch user"));
            })

            .addCase(UpdattingOfUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(UpdattingOfUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                toast.success("User updated successfully");
            })
            .addCase(UpdattingOfUser.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(getErrorMessage(action.payload, "Failed to update user"));
            })

            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(getErrorMessage(action.payload, "Failed to fetch users"));
            });
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;