// Blatantly ripped from http://adripofjavascript.com/blog/drips/making-deep-property-access-safe-in-javascript.html

const deepGetByArray = (
  obj: object,
  props: string[],
  defaultValue: any,
): any => {
  // If we have reached an undefined/null property
  // then stop executing and return the default value.
  // If no default was provided it will be undefined.
  if (obj == null) {
    return defaultValue;
  }

  // If the path array has no more elements, we've reached
  // the intended property and return its value
  if (props.length === 0) {
    return obj;
  }

  // Prepare our found property and path array for recursion
  const foundSoFar = obj[props[0]];
  const remainingProps = props.slice(1);

  return deepGetByArray(foundSoFar, remainingProps, defaultValue);
};

export function deepGet(
  props: string | string[],
  obj: any,
  defaultValue?: any,
) {
  if (typeof props === 'string') {
    props = props.split('.');
  }

  if (props.length === 1) return obj[props[0]];

  return deepGetByArray(obj, props, defaultValue);
}
