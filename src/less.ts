import less from "less";

export function renderLessAsync(
  contents: string,
  opts: {
    paths?: string[];
  }
): Promise<{ css: string }> {
  return new Promise((resolve, reject) => {
    less.render(contents, opts, (err, output) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(output);
    });
  });
}
