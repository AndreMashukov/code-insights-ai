import { baseApi } from "../baseApi";
import {
  Directory,
  DirectoryEnhanced,
  DirectoryTreeNode,
  CreateDirectoryRequest,
  CreateDirectoryResponse,
  UpdateDirectoryRequest,
  DeleteDirectoryRequest,
  GetDirectoriesResponse,
  GetDirectoryTreeResponse,
} from "@shared-types";

export const directoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all directories with document counts
    getDirectories: builder.query<GetDirectoriesResponse, void>({
      query: () => ({
        functionName: "getDirectories",
      }),
      providesTags: ["Directory"],
      keepUnusedDataFor: 300, // 5 minutes
    }),

    // Get directory tree for sidebar navigation
    getDirectoryTree: builder.query<GetDirectoryTreeResponse, void>({
      query: () => ({
        functionName: "getDirectoryTree",
      }),
      providesTags: ["Directory"],
      keepUnusedDataFor: 300, // 5 minutes
    }),

    // Get single directory by ID
    getDirectory: builder.query<Directory, string>({
      query: (directoryId) => ({
        functionName: "getDirectory",
        data: { directoryId },
      }),
      providesTags: (result, error, directoryId) => [
        { type: "Directory", id: directoryId },
      ],
    }),

    // Create new directory
    createDirectory: builder.mutation<CreateDirectoryResponse, CreateDirectoryRequest>({
      query: (data) => ({
        functionName: "createDirectory",
        data,
      }),
      invalidatesTags: ["Directory"],
    }),

    // Update directory
    updateDirectory: builder.mutation<Directory, UpdateDirectoryRequest>({
      query: (data) => ({
        functionName: "updateDirectory",
        data,
      }),
      invalidatesTags: (result, error, { directoryId }) => [
        { type: "Directory", id: directoryId },
        "Directory",
      ],
    }),

    // Delete directory
    deleteDirectory: builder.mutation<void, DeleteDirectoryRequest>({
      query: (data) => ({
        functionName: "deleteDirectory",
        data,
      }),
      invalidatesTags: ["Directory"],
    }),
  }),
});

export const {
  useGetDirectoriesQuery,
  useGetDirectoryTreeQuery,
  useGetDirectoryQuery,
  useCreateDirectoryMutation,
  useUpdateDirectoryMutation,
  useDeleteDirectoryMutation,
} = directoryApi;
