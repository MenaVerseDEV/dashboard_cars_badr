import { Variant } from "@/types/variants";

// Generate a unique ID
export const generateId = () => Math.random().toString(36).substring(2, 9);

// Delete a variant
export const deleteVariant = (
  variants: Variant[],
  variantId: string
): Variant[] => {
  return variants.filter((variant) => variant.id !== variantId);
};

// Delete a sub-variant
export const deleteSubVariant = (
  variants: Variant[],
  variantId: string,
  subVariantId: string
): Variant[] => {
  return variants.map((variant) => {
    if (variant.id === variantId) {
      return {
        ...variant,
        subVariants: variant.subVariants.filter(
          (subVariant) => subVariant.id !== subVariantId
        ),
      };
    }
    return variant;
  });
};

// Delete a value
export const deleteValue = (
  variants: Variant[],
  variantId: string,
  subVariantId: string,
  valueId: string
): Variant[] => {
  return variants.map((variant) => {
    if (variant.id === variantId) {
      return {
        ...variant,
        subVariants: variant.subVariants.map((subVariant) => {
          if (subVariant.id === subVariantId) {
            return {
              ...subVariant,
              values: subVariant.values.filter((value) => value.id !== valueId),
            };
          }
          return subVariant;
        }),
      };
    }
    return variant;
  });
};
