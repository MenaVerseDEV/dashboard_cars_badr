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
        url: `/model/model-type`,
        method: "POST",
        body: data,
      }),
    }),
    // get all model types
    getAllModelTypes: builder.query<
      SuccessResponse<{ modelTypes: IModelType[] }>,
      void
    >({
      query: () => `/model/model-type`,
    }),

    // ########### model  ###########
    getAllmodeltsByBrandId: builder.query<
      SuccessResponse<{
        models: IModel[];
        pagination: IPagination;
      }>,
      { id: number; page: number; search: string }
    >({
      // model/model/1
      query: ({ id, page, search }) =>
        `/model/model/brand/${id}?limit=10&page=${page}&search=${search}`,
      providesTags: ["Model"],
    }),
    // get model by id
    getmodelById: builder.query<
      SuccessResponse<{ model: ISingleModel }>,
      number
    >({
      query: (id) => `/model/model/${id}`,
      providesTags: ["Model"],
    }),
    // add model
    addModel: builder.mutation<SuccessResponse, ICreateModelDto>({
      query: (data) => ({
        url: `model/model`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Model"],
    }),

    // update model
    updatemodel: builder.mutation<
      SuccessResponse,
      { id: number; model: ICreateModelDto }
    >({
      query: ({ id, model }) => ({
        url: `model/model/${id}`,
        method: "PATCH",
        body: model,
      }),
      invalidatesTags: ["Model"],
    }),

    // delete model
    deletemodel: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/model/model/${id}`,
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
  useGetAllmodeltsByBrandIdQuery,
  useGetmodelByIdQuery,
  useAddModelMutation,
  useUpdatemodelMutation,
  useDeletemodelMutation,
} = modelApi;
