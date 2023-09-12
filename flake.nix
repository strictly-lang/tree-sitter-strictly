{
  description = "Compiler for the strictly language";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, flake-utils }:
       let  packageName = "tree-sitter-strictly";
            forAllSystems = nixpkgs.lib.genAttrs [ "x86_64-linux"];
            treeSitterStrictly = (pkgs:
              pkgs.stdenv.mkDerivation {
                name = "tree-sitter-strictly";
                src = ./.;
                buildInputs = [ pkgs.tree-sitter pkgs.nodejs ];
                buildPhase = ''
                  tree-sitter generate
                '';
                installPhase = ''
                  cp -r . $out
                '';
              }
            );
       in {
          packages = forAllSystems(system:
            let pkgs = nixpkgs.legacyPackages.${system}; 
            
            in {
              default = treeSitterStrictly pkgs;
            }
          );
          devShells = forAllSystems(system:
            let pkgs = nixpkgs.legacyPackages.${system};
            
            in {
              default =  pkgs.mkShell {
                buildInputs = [ pkgs.graphviz ];
              };
            }
          );
          checks = forAllSystems(system:
            let pkgs = nixpkgs.legacyPackages.${system};

            in {
              default = pkgs.stdenv.mkDerivation {
                name = "tree-sitter-strictly-test";
                src = ./.;
                buildInputs = [ pkgs.tree-sitter pkgs.nodejs self.packages.${system}.default ];
                buildPhase = ''
                  cd ${self.packages.${system}.default}
                  XDG_CACHE_HOME=$TMPDIR tree-sitter test
                  touch $out
                '';
              };
            }
         );
      };
}

