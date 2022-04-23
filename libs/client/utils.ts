export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

// export function upload
export function currentProgress(
  state: string | undefined,
  sale: string,
  reserve: string,
  done: string,
  none: string
) {
  if (state === undefined) {
    return sale;
  } else if (state === "reserved") {
    return reserve;
  } else if (state === "sold") {
    return done;
  } else {
    return none;
  }
}
