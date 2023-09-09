{
  description = "Compiler for the strictly language";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = nixpkgs.legacyPackages.${system};
            packageName = "tree-sitter-strictly";
            buildInputs = [ pkgs.tree-sitter pkgs.nodejs pkgs.graphviz ];
       in {
          defaultPackage = pkgs.stdenv.mkDerivation {
            name = "tree-sitter-strictly";
            src = ./.;
            buildInputs = buildInputs;
            buildPhase = ''
              tree-sitter generate
            '';
            installPhase = ''
              cp -r . $out
            '';
            testPhase = ''
              tree-sitter test
            '';
          };
          devShell = pkgs.mkShell {
            buildInputs = buildInputs;
          };
        }
      );
}

