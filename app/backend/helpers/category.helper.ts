import Category from "../models/category.model";
import { CategoryTreeNode, ICategory } from "../interfaces";

export const buildCategoryTree = (
  categories: ICategory[],
  parentId: string = ""
): CategoryTreeNode[] => {
  const tree: CategoryTreeNode[] = [];

  for (const item of categories) {
    if (item.parent === parentId) {
      const itemId = item._id.toString();
      const children = buildCategoryTree(categories, itemId);
      tree.push({
        id: itemId,
        name: item.name,
        slug: item.slug,
        children,
      });
    }
  }

  return tree;
};

export const getCategorySubId = async (parentId: string = ""): Promise<string[]> => {
  let listId: string[] = [];

  const children = await Category.find({
    parent: parentId,
    deleted: false,
    status: "active",
  });

  for (const item of children) {
    const itemId = item._id.toString();
    listId.push(itemId);
    const subChildrenIds = await getCategorySubId(itemId);
    listId = listId.concat(subChildrenIds);
  }

  return listId;
};
