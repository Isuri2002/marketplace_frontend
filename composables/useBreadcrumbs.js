export const useBreadcrumbs = () => {
  const route = useRoute();
  const items = [{ label: "Home", to: "/" }];

  const pathSegments = route.path.split("/").filter(Boolean);

  pathSegments.forEach((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    let label =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
    if (segment === "user") label = "Profile";
    if (segment === "reports") label = "Reports & Disputes";
    // Add more customizations as needed
    items.push({ label, to: path });
  });

  // Make the last item not a link
  if (items.length > 1) {
    const last = items.pop();
    items.push({ label: last.label });
  }

  return items;
};
