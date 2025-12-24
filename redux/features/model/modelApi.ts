import { combinedBaseApi, SuccessResponse } from "@/redux/app/baseApi";
import { IPagination } from "@/types";
import {
  ICreateModelDto,
  IModel,
  IModelType,
  ISingleModel,
} from "@/types/model";

const modelApi = combinedBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ########### model types ###########
    // add model type
    addModelType: builder.mutation<
      SuccessResponse,
      { name: { en: string; ar: string } }
    >({
      query: (data) => ({
        url: `/models/model-type`,
        method: "POST",
        body: data,
      }),
    }),
    // get all model types
    getAllModelTypes: builder.query<SuccessResponse<IModelType[]>, void>({
      query: () => `/models/model-type`,
    }),

    // ########### model  ###########
    getAllModelsByBrandId: builder.query<
      SuccessResponse<IModel[]>,
      { id: string; page: number; search: string }
    >({
      query: ({ id, page, search }) =>
        `/models/brand/${id}?limit=10&page=${page}&search=${search}&sortBy=createdAt&sortOrder=desc`,
      providesTags: ["Model"],
    }),
    // get model by id
    getmodelById: builder.query<SuccessResponse<ISingleModel>, string>({
      query: (id) => `/models/${id}`,
      providesTags: ["Model"],
    }),
    // add model
    addModel: builder.mutation<SuccessResponse, ICreateModelDto>({
      query: (data) => ({
        url: `/models`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Model"],
    }),

    // update model
    updatemodel: builder.mutation<
      SuccessResponse,
      { id: string; model: ICreateModelDto }
    >({
      query: ({ id, model }) => ({
        url: `/models/${id}`,
        method: "PATCH",
        body: model,
      }),
      invalidatesTags: ["Model"],
    }),

    // delete model
    deletemodel: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/models/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Model"],
    }),
  }),
});

export const {
  // ########### model types ###########
  useAddModelTypeMutation,
  useGetAllModelTypesQuery,

  // ########### model  ###########
  useGetAllModelsByBrandIdQuery,
  useGetmodelByIdQuery,
  useAddModelMutation,
  useUpdatemodelMutation,
  useDeletemodelMutation,
} = modelApi;
