import { cloneElement, isValidElement } from "react";
import type { ReactNode } from "react";
import { t } from "./index";
/** Localize rendered copy and accessible names. IDs, URLs, keys, handlers and
 * component identity remain untouched; open dialogs and audio keep their state.
 */
export function translateTree(node: ReactNode): ReactNode {
  if (typeof node === "string") return t(node);
  if (Array.isArray(node)) return node.map(translateTree);
  if (!isValidElement<Record<string, unknown>>(node)) return node;
  const props: Record<string, unknown> = {};
  for (const key of ["title", "alt", "aria-label", "placeholder"])
    if (typeof node.props[key] === "string") props[key] = t(node.props[key]);
  if ("children" in node.props)
    props.children = translateTree(node.props.children as ReactNode);
  return cloneElement(node, props);
}
